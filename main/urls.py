from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='tests'),
    path('test/<int:pk>/', views.test_view, name='test-view'),
    path('history/', views.history, name='history'),
    path('g1/', views.game1, name='game1'),
    path('g2/', views.game2, name='game2'),
    path('result/<int:history_id>/', views.result_view, name='result'),  # Новый маршрут для результатов
    path('test-detail/<int:history_id>/', views.test_detail, name='test-detail'),  # Новый маршрут для деталей
    path('chemistry-xmind-game/', views.chemistry_xmind_game, name='chemistry-xmind-game'),
]