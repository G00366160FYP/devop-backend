output "db_port"{
    description = "Port for the RDS instance"
    value = aws_db_instance.main.port
}

output "db_name"{
    description = "Name of the RDS instance"
    value = aws_db_instance.main.db_name
}
  

output "db_username" {
    description = "Username for the RDS instance"
    value = aws_db_instance.main.username
    sensitive = true
}

output "db_endpoint" {
    description = "The connection endpoint for the MySql database"
    value = aws_db_instance.main.endpoint
}