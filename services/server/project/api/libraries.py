# services/server/project/api/libraries.py

from flask import Blueprint, request
from flask_restful import Resource, Api

from project import db
from project.api.models import Library

from project.api.functions import get_pypi_version

from sqlalchemy import exc


libraries_blueprint = Blueprint('libraries', __name__)
api = Api(libraries_blueprint)


class ServerHome(Resource):
    def get(self):
        return {
            'message': 'welcome!',
        }


class LibrariesList(Resource):
    def get(self):
        page = request.args.get('page', default=1, type=int)
        libraries = Library.query.order_by(Library.id.desc()).paginate(page, 25, False)
        response_object = {
            'status': 'success',
            'libraries': [library.to_json() for library in libraries.items]
        }
        return response_object, 200


class Libraries(Resource):
    def get(self, library_id):
        """Get single library details"""
        response_object = {
            'status': 'fail',
            'message': 'Library does not exist'
        }
        try:
            library = Library.query.filter_by(id=int(library_id)).first()
            if not library:
                return response_object, 400
            else:
                response_object = {
                    'status': 'success',
                    'library': library.to_json()
                }

                response_object = get_pypi_version(response_object)

                return response_object, 200
        except ValueError:
            return response_object, 400

    def put(self, library_id):
        """Update exisiting Library"""
        put_data = request.get_json()

        response_object = {
            'status': 'fail',
            'message': 'Invalid payload.'
        }

        if not put_data:
            return response_object, 400

        name = put_data.get('name')
        repository = put_data.get('repository')
        download_count = put_data.get('download_count')
        issue_count = put_data.get('issue_count')
        author = put_data.get('author')
        user_rating = put_data.get('user_rating')

        updated_library = Library.query.filter_by(id=library_id).first()

        if updated_library:
            if name:
                updated_library.name = name
            if repository:
                updated_library.repository = repository
            if download_count:
                updated_library.download_count = download_count
            if issue_count:
                updated_library.issue_count = issue_count
            if author:
                updated_library.author = author
            if user_rating:
                updated_library.user_rating = user_rating

            db.session.commit()
            response_object['status'] = 'success'
            response_object['message'] = f'Library {name} was updated!'
            return response_object, 204

        response_object['message'] = 'Sorry. That library does not exist'
        return response_object, 400

    def delete(self, library_id):
        """Delete exisiting Library"""
        Library.query.filter_by(id=library_id).delete()
        db.session.commit()
        response_object = {
            'status': 'success',
            'message': 'Library deleted'
        }
        return response_object, 200


class NewLibrary(Resource):
    def post(self):
        """Create new library"""
        post_data = request.get_json()

        response_object = {
            'status': 'fail',
            'message': 'Invalid payload.'
        }

        if not post_data:
            return response_object, 400

        name = post_data.get('name')
        repository = post_data.get('repository')
        download_count = post_data.get('download_count')
        issue_count = post_data.get('issue_count')
        author = post_data.get('author')
        user_rating = post_data.get('user_rating')

        try:
            library = Library.query.filter_by(name=name, repository=repository).first()
            if not library:
                db.session.add(
                    Library(
                        name=name,
                        repository=repository,
                        download_count=download_count,
                        issue_count=issue_count,
                        author=author,
                        user_rating=user_rating
                    )
                )
                db.session.commit()
                response_object['status'] = 'success'
                response_object['message'] = f'Library {name} was added!'
                return response_object, 201
            else:
                response_object['message'] = 'Sorry. That library already exists.'
                return response_object, 400
        except exc.DataError:
            db.session.rollback()
            return response_object, 400


api.add_resource(ServerHome, '/')
api.add_resource(LibrariesList, '/libraries')
api.add_resource(Libraries, '/library/<int:library_id>')
api.add_resource(NewLibrary, '/library')
