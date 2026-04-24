from myapp.models import AppSetting


def get_setting(key, default=None):
    setting = AppSetting.objects.filter(key=key).first()
    if setting is None:
        return default
    return setting.value


def set_setting(key, value):
    setting, _ = AppSetting.objects.update_or_create(
        key=key,
        defaults={"value": value},
    )
    return setting
