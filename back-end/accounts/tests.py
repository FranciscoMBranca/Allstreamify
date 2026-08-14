import json

from django.test import TestCase


class AuthEndpointsTests(TestCase):
    def test_register_and_login_user(self):
        payload = {
            "email": "maria@example.com",
            "username": "maria",
            "password": "senha123",
            "first_name": "Maria",
            "last_name": "Silva",
        }

        register_response = self.client.post(
            "/api/accounts/register",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(register_response.status_code, 200, register_response.content)
        body = register_response.json()
        self.assertIn("access_token", body)
        self.assertEqual(body["user"]["email"], payload["email"])

        login_response = self.client.post(
            "/api/accounts/login",
            data=json.dumps({
                "email": payload["email"],
                "password": payload["password"],
            }),
            content_type="application/json",
        )

        self.assertEqual(login_response.status_code, 200, login_response.content)
        self.assertEqual(login_response.json()["user"]["email"], payload["email"])
