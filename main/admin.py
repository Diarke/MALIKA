from django.contrib import admin
from .models import *
# Register your models here.

class AnswersInline(admin.TabularInline):
    model = Answers
    extra = 4

class QuestionsAdmin(admin.ModelAdmin):
    inlines = [AnswersInline]

admin.site.register(Subject)
admin.site.register(Questions, QuestionsAdmin)
admin.site.register(History)
admin.site.register(UserAnswer)
