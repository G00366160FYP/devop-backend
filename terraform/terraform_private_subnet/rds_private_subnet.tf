variable "vpc_id" {
    description = "Id of the existing VPC where subnets will be created"
    type = string
  
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type = list(string)
}

data "aws_vpc" "existing" {
    id = var.vpc_id
}

data "aws_availability_zones" "available"{
    state = "available"
}

resource "aws_subnet" "private" {
    count = 2
    vpc_id = data.aws_vpc.existing.id
    cidr_block = var.private_subnet_cidrs[count.index]
    availability_zone = data.aws_availability_zones.available.names[count.index]

    tags = {
        Name = "private-subnet-${count.index}"
        Type = "private"
    }
  
}

resource "aws_route_table" "private" {
    vpc_id = data.aws_vpc.existing.id

    tags = {
      Name = "private-route-table"
    }
  
}

resource "aws_route_table_association" "private" {
    count = length(aws_subnet.private)
    subnet_id = aws_subnet.private[count.index].id
    route_table_id = aws_route_table.private.id
}

output "private_subnet_ids" {
    value = aws_subnet.private[*].id
    description = "List of private subnet IDs"
}

resource "aws_ssm_parameter" "private_subnet_ids" {
    name  = "/infra/private-subnet-ids"
    type  = "StringList"
    value = join(",", aws_subnet.private[*].id)

    tags = {
        Name = "private-subnet-ids"
    }  
}

