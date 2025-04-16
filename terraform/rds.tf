resource "aws_db_subnet_group" "database" {
    name       = "backend-db-subnet-group"
    description = "Database subnet group for backend services"
    subnet_ids = [
      "subnet-0c4d266caf2fcfe7b",
      "subnet-02cc1a0b546a2c3bd",
      "subnet-02882351c007aa185"
    ]
    tags       = { Name = "my-db-subnet-group" }
}

resource "aws_security_group" "database" {
  name = "backend-database-security-group"
  description = "Allow Mysql traffic from EKS cluster"
  vpc_id = var.vpc_id

  ingress {
    from_port = 3306
    to_port  = 3306
    protocol = "tcp"
    security_groups = ["sg-03b7a001baba12f8a", "sg-01f1274d73b2b227b"]
    cidr_blocks = ["10.100.0.0/16", "51.171.96.248/32" ]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "backend-database-security-group"
  }
}

resource "aws_db_parameter_group" "mysql" {
    name = "backend-mysql-params"
    family = "mysql8.0"
    description = "Custom parameter group for backend MySql database"

    parameter {
      name = "character_set_server"
      value = "utf8mb4"
    }

    parameter {
      name = "collation_server"
      value = "utf8mb4_unicode_ci"
    }

    parameter {
      name = "max_connections"
      value = "160"
    }
  
}

resource "aws_db_instance" "main" {
    identifier = "backend-mysql-db"
    engine = "mysql"
    engine_version = "8.0"
    instance_class = "db.t3.medium"
    allocated_storage = 20
    max_allocated_storage = 100
    storage_type = "gp2"
    storage_encrypted = true

    db_name = var.db_name
    username = var.db_username
    password = var.db_password
    port = 3306

    parameter_group_name = aws_db_parameter_group.mysql.name
    db_subnet_group_name = aws_db_subnet_group.database.name
    vpc_security_group_ids = [aws_security_group.database.id]

    multi_az = true
    publicly_accessible = true

    backup_retention_period = 7
    backup_window = "12:00-13:00"
    maintenance_window = "Sun:13:00-Sun:14:00"

    performance_insights_enabled = true
    performance_insights_retention_period = 7

    monitoring_interval = 60
    monitoring_role_arn = aws_iam_role.rds_monitoring_role.arn

    deletion_protection = false
    skip_final_snapshot = true

    final_snapshot_identifier = "backend-database-final-snapshot"

    tags = {
        Name = "backend-mysql-database"
        service = "backend"
    }

    depends_on = [ 
        aws_db_subnet_group.database,
        aws_security_group.database
     ]
}

resource "aws_iam_role" "rds_monitoring_role" {
    name = "rds-monitoring-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Action = "sts:AssumeRole",
                Effect = "Allow",
                Principal = {
                    Service = "monitoring.rds.amazonaws.com"
                }
            }
        ]
    })

    managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"]

}
