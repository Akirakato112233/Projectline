from functools import wraps

from rest_framework.response import Response


def admin_login_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if not request.session.get("dashboard_authenticated"):
            return Response({"message": "Unauthorized"}, status=401)

        return view_func(request, *args, **kwargs)

    return wrapped_view
