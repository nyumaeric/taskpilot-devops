provider "azurerm" {
  features {}
  use_oidc = true  # Recommended for secure authentication
}

resource "azurerm_resource_group" "taskpilot" {
  name     = "taskpilot-resources"
  location = "East US"
}

resource "azurerm_container_registry" "acr" {
  name                = "taskpilotacr"
  resource_group_name = azurerm_resource_group.taskpilot.name
  location            = azurerm_resource_group.taskpilot.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_app_service_plan" "app_service_plan" {
  name                = "taskpilot-service-plan"
  location            = azurerm_resource_group.taskpilot.location
  resource_group_name = azurerm_resource_group.taskpilot.name
  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = "taskpilot-webapp"
  location            = azurerm_resource_group.taskpilot.location
  resource_group_name = azurerm_resource_group.taskpilot.name
  app_service_plan_id = azurerm_app_service_plan.app_service_plan.id

  site_config {
    linux_fx_version = "DOCKER|<youracr>.azurecr.io/frontend:latest"
  }

  app_settings = {
    WEBSITES_PORT = "80"
    DOCKER_REGISTRY_SERVER_URL = "https://<youracr>.azurecr.io"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr.admin_password
  }
}
