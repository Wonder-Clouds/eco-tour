from rest_framework import serializers
from auditlog.models import LogEntry


class LogEntrySerializer(serializers.ModelSerializer):
    actor = serializers.SerializerMethodField()
    action_display = serializers.SerializerMethodField()
    content_type_name = serializers.SerializerMethodField()

    class Meta:
        model = LogEntry
        fields = [
            'id',
            'object_pk',
            'object_repr',
            'action',
            'action_display',
            'changes',
            'actor',
            'remote_addr',
            'timestamp',
            'content_type_name',
        ]

    def get_actor(self, obj):
        if obj.actor:
            return {
                'id': obj.actor.id,
                'username': obj.actor.username,
                'email': obj.actor.email if hasattr(obj.actor, 'email') else None,
            }
        return None

    def get_action_display(self, obj):
        action_map = {
            LogEntry.Action.CREATE: 'Create',
            LogEntry.Action.UPDATE: 'Update',
            LogEntry.Action.DELETE: 'Delete',
        }
        return action_map.get(obj.action, 'Unknown')

    def get_content_type_name(self, obj):
        if obj.content_type:
            return f"{obj.content_type.app_label}.{obj.content_type.model}"
        return None
