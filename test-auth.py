
# test_auth.py
"""
Test script for the authentication system
"""
import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000"

async def test_authentication_flow():
    """Test the complete authentication flow"""
    async with httpx.AsyncClient() as client:
        print("🧪 Testing Authentication System")
        print("=" * 40)

        # Test user registration
        print("1. Testing user registration...")
        register_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User"
        }

        response = await client.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code == 201:
            print("✅ User registration successful")
        else:
            print(f"❌ User registration failed: {response.text}")
            return

        # Test login (should fail because email not verified)
        print("\n2. Testing login before email verification...")
        login_data = {
            "email": "test@example.com",
            "password": "TestPassword123!"
        }

        response = await client.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful")
            token_data = response.json()
            access_token = token_data["access_token"]

            # Test authenticated endpoint
            print("\n3. Testing authenticated endpoint...")
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get(f"{BASE_URL}/auth/me", headers=headers)

            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ User data retrieved: {user_data['email']}")
            else:
                print(f"❌ Failed to get user data: {response.text}")
        else:
            print(f"⚠️  Login failed (expected if email not verified): {response.text}")

        # Test health check
        print("\n4. Testing health check...")
        response = await client.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.text}")

def main():
    """Run the test"""
    try:
        asyncio.run(test_authentication_flow())
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    main()