provider "aws" {
    region = "eu-north-1"
}

provider "kubernetes" {
    host                   = data.aws_eks_cluster.existing_cluster.endpoint
    insecure = true

    exec {
        api_version = "client.authentication.k8s.io/v1beta1"
        command     = "aws"
        args        = ["eks", "get-token", "--cluster-name", local.cluster_name]
    }
}

locals {
    cluster_name = "devops-eks"
}

data "aws_eks_cluster" "existing_cluster" {
    name = local.cluster_name
}

resource "kubernetes_deployment" "register_service" {
    metadata {
      name = "register-service"
      labels = {
        app = "register-service"
      }
    }

    spec {
        replicas = 2

        selector {
            match_labels = {
                app = "register-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "register-service"
                }
            }

            spec {
                container {
                    name  = "register-service"
                    image = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/register-service:latest"

                    command = ["node"]
                    args = ["/project/register-service/index.js"]

                    port {
                        container_port = 3000
                    }

                    resources {
                      limits = {
                        cpu = "0.5"
                        memory = "512Mi"
                      }
                      requests = {
                        cpu = "250m"
                        memory = "256Mi"
                      }
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "register_service" {
    metadata {
        name = "register-service"
    }

    spec {
        selector = {
            app = "register-service"
        }

        port {
            port        = 80
            target_port = 3000
        }

        type = "ClusterIP"
    }
}



  