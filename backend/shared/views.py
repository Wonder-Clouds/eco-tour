from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_countries import countries

class CountryListView(APIView):
    """
    API view to return a list of countries.
    """

    def get(self, request, format=None):
        country_data = [
            {
                'value': code,
                'label': name
            }
            for code, name in countries
        ]

        return Response(country_data, status=status.HTTP_200_OK)
