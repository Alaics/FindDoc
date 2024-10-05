from django.urls import path
from base import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('',views.getRoutes,name="getRoutes"),
    path('users/register/',views.registerUser,name='register'),
    path('users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/',views.getUserProfile,name="getUserProfiles"),
    path('users/',views.getUsers,name="getUsers"),
    path('users/profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('users/<str:pk>/', views.getUserById, name='user'),
    path('users/update/<str:pk>/', views.updateUser, name='user-update'),
    path('users/delete/<str:pk>/', views.deleteUser, name='user-delete'),

    path('products/',views.getProducts,name="getProducts"),
    path('products/<str:pk>',views.getProduct,name="getProduct"),

    path('orders/', views.getOrders, name='orders'),
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),

    path('doctors/', views.getAllDoctors, name='get-all-doctors'),
    path('doctors/<str:pk>/', views.getDoctorDetail, name='get-doctor-detail'),

    #For Rating/Review/Feedback
    path('doctors/<str:pk>/reviews/',views.createDoctorReview,name="create-doctor-review"),

    path('appointments/create/', views.create_appointment, name='create-appointment'),

]
