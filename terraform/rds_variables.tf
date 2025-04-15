variable "vpc_id" {
    description = "The ID of the VPC where the RDS instance will be created"
    type = string
}

variable "my_ip" {
    description = "My Ip address for database access"
    type = string
}

// variable "eks_security_group_id" {
//    description = "Security group ID of the EKS cluster"
//    type = string
//}

variable "db_name" {
    description = "Name of the  database"
    type = string
}

variable "db_username" {
description = "Username for database"
type = string
sensitive = true
}

variable "db_password" {
    description = "Password for the database"
    type = string
    sensitive = true
}

