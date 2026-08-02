import json

from django.contrib.auth.models import User
from django.test import TestCase


class ApiSmokeTests(TestCase):
    def test_health_endpoint(self):
        response = self.client.get('/api/health')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    def test_dashboard_endpoint(self):
        response = self.client.get('/api/dashboard')

        self.assertEqual(response.status_code, 200)
        self.assertIn('summary', response.json())
        self.assertIn('platforms', response.json())

    def test_accounts_endpoint(self):
        response = self.client.get('/api/accounts/perfis')

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_social_endpoint(self):
        response = self.client.get('/api/social/contas')

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_platform_connect_endpoint_handles_missing_payload_and_real_post(self):
        user = User.objects.create_user(username='streamer', email='streamer@example.com')

        missing_payload_response = self.client.get('/api/platforms/connect?additionalProp1=%7B%7D')
        self.assertEqual(missing_payload_response.status_code, 200)
        self.assertIn('Use POST', missing_payload_response.json()['message'])

        payload = {
            'userId': user.id,
            'platformId': 'youtube',
            'username': 'demo_streamer',
            'platformUserId': 'channel-123',
            'displayName': 'Demo Streamer',
        }
        post_response = self.client.post(
            '/api/platforms/connect',
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(post_response.status_code, 200)
        self.assertTrue(post_response.json()['success'])
        self.assertEqual(post_response.json()['platform'], 'youtube')
