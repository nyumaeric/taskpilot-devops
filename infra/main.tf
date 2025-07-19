terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_resource_group" "taskpilot" {
  name     = "taskpilot-rg-${random_string.suffix.result}"
  location = "East US 2"
}

resource "azurerm_container_registry" "acr" {
  name                = "taskpilotacr${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.taskpilot.name
  location            = azurerm_resource_group.taskpilot.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_log_analytics_workspace" "logs" {
  name                = "taskpilot-logs-${random_string.suffix.result}"
  location            = azurerm_resource_group.taskpilot.location
  resource_group_name = azurerm_resource_group.taskpilot.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "container_env" {
  name                       = "taskpilot-env-${random_string.suffix.result}"
  location                   = azurerm_resource_group.taskpilot.location
  resource_group_name        = azurerm_resource_group.taskpilot.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
}

resource "azurerm_container_app" "backend" {
  name                         = "taskpilot-backend"
  container_app_environment_id = azurerm_container_app_environment.container_env.id
  resource_group_name          = azurerm_resource_group.taskpilot.name
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  = "${azurerm_container_registry.acr.login_server}/taskpilot-backend:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "MONGO_URI"
        value = "mongodb+srv://nyumaeric:Eric%402002@cluster0.huob0.mongodb.net/taskpilot?retryWrites=true&w=majority"
      }

      env {
        name  = "PORT"
        value = "3000"
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }

    min_replicas = 1
    max_replicas = 2
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.acr.admin_password
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "registry-password"
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    transport                  = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

resource "azurerm_container_app" "frontend" {
  name                         = "taskpilot-frontend"
  container_app_environment_id = azurerm_container_app_environment.container_env.id
  resource_group_name          = azurerm_resource_group.taskpilot.name
  revision_mode                = "Single"

  template {
    container {
      name   = "frontend"
      image  = "${azurerm_container_registry.acr.login_server}/taskpilot-frontend:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "REACT_APP_API_URL"
        value = "https://${azurerm_container_app.backend.latest_revision_fqdn}"
      }
    }

    min_replicas = 1
    max_replicas = 2
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.acr.admin_password
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "registry-password"
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 80
    transport                  = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

output "container_registry_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "container_registry_admin_username" {
  value = azurerm_container_registry.acr.admin_username
}

output "container_registry_admin_password" {
  value     = azurerm_container_registry.acr.admin_password
  sensitive = true
}

output "backend_url" {
  value = "https://${azurerm_container_app.backend.latest_revision_fqdn}"
}

output "frontend_url" {
  value = "https://${azurerm_container_app.frontend.latest_revision_fqdn}"
}

output "resource_group_name" {
  value = azurerm_resource_group.taskpilot.name
}