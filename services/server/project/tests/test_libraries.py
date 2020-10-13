# services/server/project/tests/test_links.py

import json
import unittest

from project.tests.base import BaseTestCase

from project import db
from project.api.models import Library


def add_library(name, repository, download_count, issue_count, author, user_rating):
    lib = Library(name, repository, download_count, issue_count, author, user_rating)
    db.session.add(lib)
    db.session.commit()
    return lib


class TestRoutes(BaseTestCase):
    """Tests for the server."""

    def test_server_home(self):
        """Ensure the / route behaves correctly."""
        response = self.client.get('/')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('welcome!', data['message'])

    def test_get_all_libraries(self):
        """Ensure /libraries returns all libraries"""
        lib1 = add_library("Cool library", "NPM", 2000, 5, "Glen", 5)
        lib2 = add_library("Not so cool library", 'NPM', 200, 500, "Neil", 2)

        with self.client:
            response = self.client.get('/libraries')
            data = json.loads(response.data.decode())
            self.assertIn('success', data['status'])
            self.assertEqual(response.status_code, 200)
            self.assertIn(lib1.name, data['libraries'][1]['name'])
            self.assertIn(lib2.name, data['libraries'][0]['name'])

    def test_get_all_libraries_page1(self):
        """Ensure /libraries page1 returned"""
        for i in range(26):
            add_library(f"Cool library{i}", "NPM", 2000, 5, "Glen", 5)

        with self.client:
            response = self.client.get('/libraries', query_string={'page': 1})
            data = json.loads(response.data.decode())
            self.assertIn('success', data['status'])
            self.assertEqual(response.status_code, 200)
            self.assertEqual(25, len(data['libraries']))

    def test_get_all_libraries_page2(self):
        """Ensure /libraries page2 returned"""
        for i in range(36):
            add_library(f"Cool library{i}", "NPM", 2000, 5, "Glen", 5)

        with self.client:
            response = self.client.get('/libraries', query_string={'page': 2})
            data = json.loads(response.data.decode())
            self.assertIn('success', data['status'])
            self.assertEqual(response.status_code, 200)
            self.assertEqual(11, len(data['libraries']))

    def test_get_specific_library(self):
        """Ensure /library/{id} returns correct library"""
        lib = add_library("Cool library", "NPM", 2000, 5, "Glen", 5)

        with self.client:
            response = self.client.get(f'/library/{lib.id}')
            data = json.loads(response.data.decode())
            self.assertIn('success', data['status'])
            self.assertEqual(response.status_code, 200)
            self.assertIn(lib.name, data['library']['name'])
            self.assertIn(lib.repository, data['library']['repository'])
            self.assertEqual(lib.download_count, data['library']['download_count'])

    def test_get_specific_library_missing(self):
        """Ensure /library/{id} handles nonexistant library"""
        with self.client:
            response = self.client.get('/library/1')
            data = json.loads(response.data.decode())
            self.assertIn('fail', data['status'])
            self.assertEqual(response.status_code, 400)
            self.assertIn('Library does not exist', data['message'])

    def test_add_library(self):
        """Ensure a new link can be added."""

        post_data = {
            "name": "Cool lib",
            "repository": "Github",
            "download_count": 20,
            "issue_count": 6,
            "author": "glen",
            "user_rating": 5,
        }

        with self.client:
            response = self.client.post(
                '/library',
                data=json.dumps(post_data),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn(f'Library {post_data["name"]} was added!', data['message'])
            self.assertIn('success', data['status'])

        with self.client:
            response = self.client.get('/libraries')
            data = json.loads(response.data.decode())
            self.assertIn('success', data['status'])
            self.assertEqual(response.status_code, 200)
            self.assertIn(post_data["name"], data['libraries'][0]['name'])

    def test_add_library_empty_data(self):
        """Ensure empty post data is handled"""
        with self.client:
            response = self.client.post(
                '/library',
                data=json.dumps({}),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_library_bad_data_type(self):
        """Ensure wrong type cant be added to db"""

        post_data = {
            "name": "Cool lib",
            "repository": "Github",
            "download_count": "twenty",
            "issue_count": 6,
            "author": "glen",
            "user_rating": 5,
        }

        with self.client:
            response = self.client.post(
                '/library',
                data=json.dumps(post_data),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_library_duplicate_library(self):
        """Ensure a duplicate library cant be added"""

        post_data = {
            "name": "Cool lib",
            "repository": "Github",
            "download_count": 20,
            "issue_count": 6,
            "author": "glen",
            "user_rating": 5,
        }

        add_library(**post_data)

        with self.client:
            response = self.client.post(
                '/library',
                data=json.dumps(post_data),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Sorry. That library already exists.', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_library_name_too_long(self):
        """Ensure library name cant be longer than 100"""
        post_data = {
            "name": "0123456789A" * 10,
            "repository": "Github",
            "download_count": 20,
            "issue_count": 6,
            "author": "glen",
            "user_rating": 5,
        }

        with self.client:
            response = self.client.post(
                '/library',
                data=json.dumps(post_data),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    # TODO 
    # def test_delete_library(self):
    #     """Ensure that library can be deleted"""
    #     pass

    # TODO
    # def test_update_library(self):
    #     """Ensure that library can be updated"""
    #     pass


if __name__ == '__main__':
    unittest.main()
