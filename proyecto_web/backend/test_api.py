#!/usr/bin/env python3
"""
Script de prueba para verificar que la API funciona correctamente
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Probar endpoint de health check"""
    print("🔍 Probando health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check OK")
            return True
        else:
            print(f"❌ Health check falló: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error en health check: {e}")
        return False

def test_register():
    """Probar registro de usuario"""
    print("🔍 Probando registro de usuario...")
    try:
        data = {
            "email": "test@example.com",
            "name": "Usuario de Prueba",
            "password": "test123"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        if response.status_code == 200:
            print("✅ Registro exitoso")
            return True
        else:
            print(f"❌ Registro falló: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error en registro: {e}")
        return False

def test_login():
    """Probar login de admin"""
    print("🔍 Probando login de admin...")
    try:
        data = {
            "email": "admin@example.com",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Login exitoso")
            return token_data.get("access_token")
        else:
            print(f"❌ Login falló: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return None

def test_products(token=None):
    """Probar endpoints de productos"""
    print("🔍 Probando endpoints de productos...")
    try:
        # Obtener productos
        response = requests.get(f"{BASE_URL}/products")
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Productos obtenidos: {len(products)} productos")
            
            if len(products) > 0:
                product_id = products[0]["id"]
                print(f"   - Primer producto: {products[0]['name']} - ${products[0]['price']}")
                return product_id
            else:
                print("⚠️  No hay productos disponibles")
                return None
        else:
            print(f"❌ Error obteniendo productos: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error en productos: {e}")
        return None

def test_cart(token, product_id):
    """Probar endpoints del carrito"""
    if not token:
        print("⚠️  No hay token, saltando pruebas del carrito")
        return False
    
    print("🔍 Probando endpoints del carrito...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Agregar al carrito
        cart_data = {
            "product_id": product_id,
            "quantity": 2
        }
        response = requests.post(f"{BASE_URL}/cart/add", json=cart_data, headers=headers)
        if response.status_code == 200:
            print("✅ Producto agregado al carrito")
        else:
            print(f"❌ Error agregando al carrito: {response.status_code}")
            return False
        
        # Ver carrito
        response = requests.get(f"{BASE_URL}/cart/", headers=headers)
        if response.status_code == 200:
            cart = response.json()
            print(f"✅ Carrito obtenido: {len(cart['items'])} items - Total: ${cart['total']}")
        else:
            print(f"❌ Error obteniendo carrito: {response.status_code}")
            return False
        
        # Ver total
        response = requests.get(f"{BASE_URL}/cart/total", headers=headers)
        if response.status_code == 200:
            total = response.json()
            print(f"✅ Total del carrito: ${total['total']}")
        else:
            print(f"❌ Error obteniendo total: {response.status_code}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Error en carrito: {e}")
        return False

def test_chat(token):
    """Probar endpoints del chat"""
    print("🔍 Probando endpoints del chat...")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    try:
        # Obtener mensajes
        response = requests.get(f"{BASE_URL}/chat/messages", headers=headers)
        if response.status_code == 200:
            messages = response.json()
            print(f"✅ Mensajes obtenidos: {len(messages['messages'])} mensajes")
        else:
            print(f"❌ Error obteniendo mensajes: {response.status_code}")
            return False
        
        # Enviar mensaje (si hay token)
        if token:
            message_data = {"message": "¡Hola desde las pruebas!"}
            response = requests.post(f"{BASE_URL}/chat/messages", json=message_data, headers=headers)
            if response.status_code == 200:
                print("✅ Mensaje enviado")
            else:
                print(f"❌ Error enviando mensaje: {response.status_code}")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Error en chat: {e}")
        return False

def test_dashboard(token):
    """Probar endpoints del dashboard"""
    if not token:
        print("⚠️  No hay token, saltando pruebas del dashboard")
        return False
    
    print("🔍 Probando endpoints del dashboard...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Estadísticas del dashboard:")
            print(f"   - Usuarios: {stats['total_users']}")
            print(f"   - Productos: {stats['total_products']}")
            print(f"   - Facturas: {stats['total_invoices']}")
            print(f"   - Ventas totales: ${stats['total_sales']}")
            return True
        else:
            print(f"❌ Error obteniendo estadísticas: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error en dashboard: {e}")
        return False

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas de la API...")
    print("=" * 50)
    
    # Esperar un poco para que la API esté lista
    print("⏳ Esperando que la API esté lista...")
    time.sleep(2)
    
    # Probar health check
    if not test_health():
        print("❌ La API no está funcionando correctamente")
        return
    
    print("\n" + "=" * 50)
    
    # Probar registro
    test_register()
    
    print("\n" + "=" * 50)
    
    # Probar login
    token = test_login()
    
    print("\n" + "=" * 50)
    
    # Probar productos
    product_id = test_products(token)
    
    print("\n" + "=" * 50)
    
    # Probar carrito
    if product_id:
        test_cart(token, product_id)
    
    print("\n" + "=" * 50)
    
    # Probar chat
    test_chat(token)
    
    print("\n" + "=" * 50)
    
    # Probar dashboard
    test_dashboard(token)
    
    print("\n" + "=" * 50)
    print("✅ Pruebas completadas!")
    print("\n📚 Para más información:")
    print("   - API Docs: http://localhost:8000/docs")
    print("   - ReDoc: http://localhost:8000/redoc")

if __name__ == "__main__":
    main() 