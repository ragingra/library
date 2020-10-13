import requests


def get_pypi_version(response_object):

    if response_object['library']['repository'] == "PyPI":
        library_name = response_object['library']['name']
        try:
            pypi_json = requests.get(f"https://pypi.org/pypi/{library_name}/json").json()
            response_object['library']['version'] = pypi_json['info']['version']
        except ValueError:
            print(f"PyPI Version not found for {library_name}")

    return response_object
