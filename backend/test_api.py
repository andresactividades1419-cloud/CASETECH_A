import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def make_request(url, method="GET", data=None):
    headers = {"Content-Type": "application/json"}
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {"success": False, "message": "Raw Error", "data": None, "error": res_body}
    except Exception as e:
        return 500, {"success": False, "message": str(e), "data": None, "error": str(e)}

def run_tests():
    print("=== INICIANDO PRUEBAS DE ENDPOINTS DE LA API (SPRINT 1) ===")
    
    # 1. Test Login Exitoso
    print("\n1. Probando Login Exitoso...")
    code, res = make_request(
        f"{BASE_URL}/api/auth/login", 
        method="POST", 
        data={"correo": "luis.admin@casetech.com", "password": "admin123"}
    )
    print(f"Status: {code} | Response: {res}")
    
    # 2. Test Login Fallido
    print("\n2. Probando Login Fallido (Contraseña Incorrecta)...")
    code, res = make_request(
        f"{BASE_URL}/api/auth/login", 
        method="POST", 
        data={"correo": "luis.admin@casetech.com", "password": "clave_incorrecta"}
    )
    print(f"Status: {code} | Response: {res}")

    # 3. Test Listado de Proveedores
    print("\n3. Probando Obtener Proveedores...")
    code, res = make_request(f"{BASE_URL}/api/proveedores")
    print(f"Status: {code} | Total proveedores obtenidos: {len(res.get('data', [])) if res.get('success') else 0}")
    print(f"Response: {res}")

    # 4. Registrar Proveedor (sp_registrar_proveedor)
    print("\n4. Probando Registro de Proveedor...")
    new_provider = {
        "nit": "900.888.777-6",
        "razon_social": "Maderas Casetech S.A.",
        "contacto_completo": "Andrés Felipe",
        "telefono": "3128887777",
        "correo": "contacto@maderascasetech.com",
        "direccion": "Zona Industrial Lote 14",
        "usuario_id": 1
    }
    code, res = make_request(f"{BASE_URL}/api/proveedores", method="POST", data=new_provider)
    print(f"Status: {code} | Response: {res}")

    # 5. Registrar Duplicado de NIT (Debe dar error 400)
    print("\n5. Probando Registro de NIT Duplicado...")
    code, res = make_request(f"{BASE_URL}/api/proveedores", method="POST", data=new_provider)
    print(f"Status: {code} | Response: {res}")

    # 6. Modificar Proveedor (sp_modificar_proveedor)
    # Busquemos el ID del proveedor que acabamos de registrar
    code, list_res = make_request(f"{BASE_URL}/api/proveedores")
    providers = list_res.get("data", [])
    target_id = None
    for p in providers:
        if p["nit"] == "900.888.777-6":
            target_id = p["id"]
            break
            
    if target_id:
        print(f"\n6. Probando Modificación del Proveedor ID {target_id}...")
        updated_data = {
            "razon_social": "Maderas Casetech S.A. Renovada",
            "contacto_completo": "Andrés Felipe Restrepo",
            "telefono": "3129990000",
            "correo": "ventas@maderascasetech.com",
            "direccion": "Zona Industrial Lote 15"
        }
        code, res = make_request(f"{BASE_URL}/api/proveedores/{target_id}", method="PUT", data=updated_data)
        print(f"Status: {code} | Response: {res}")

        # 7. Desactivar Proveedor (sp_desactivar_proveedor - eliminación lógica)
        print(f"\n7. Probando Desactivación (Eliminación Lógica) del Proveedor ID {target_id}...")
        code, res = make_request(f"{BASE_URL}/api/proveedores/{target_id}/desactivar", method="PATCH")
        print(f"Status: {code} | Response: {res}")

    print("\n=== PRUEBAS CONCLUIDAS ===")

if __name__ == "__main__":
    run_tests()
