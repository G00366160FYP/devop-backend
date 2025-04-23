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

resource "kubernetes_deployment" "chat_service" {
    metadata {
      name = "chat-service"
      labels = {
        app = "chat-service"
      }
    }

    spec {
        replicas = 2

        selector {
            match_labels = {
                app = "chat-service"
            }
        }

        template {
            metadata {
                labels = {
                    app = "chat-service"
                }
            }

            spec {
                container {
                    name  = "chat-service"
                    image = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/chat-service:latest"

                    command = ["node"]
                    args = ["/project/chat-service/index.js"]

                    port {
                        container_port = 3002
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

resource "kubernetes_service" "chat_service" {
    metadata {
        name = "chat-service"
    }

    spec {
        selector = {
            app = "chat-service"
        }

        port {
            port        = 80
            target_port = 3002
        }

        type = "ClusterIP"
    }
}



  