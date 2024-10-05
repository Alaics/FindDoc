from django.db import models
from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import Appointment, Doctor, Product, CustomUser, Order, OrderItem, ShippingAddress, Review
from rest_framework_simplejwt.tokens import RefreshToken




class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=User
#         fields=['id','username','email']
        
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email
        return name

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff
    
    def get_email(self, obj):
        return obj.email

class UserSerializerWithToken(UserSerializer):
    access = serializers.SerializerMethodField(read_only=True)
    refresh = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'isAdmin', 'access', 'refresh']

    def get_access(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

    def get_refresh(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token)

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

class DoctorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialization', 'license_number']

class DoctorSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only= True)
    user = UserSerializer() 

    class Meta:
        model = Doctor
        fields = '__all__'

    def get_reviews(self,obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews,many=True)
        return serializer.data

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())  # Ensure queryset is set

    class Meta:
        model = Appointment
        fields = ['id', 'user', 'doctor', 'appointment_time', 'created_at']
        read_only_fields = ['user', 'created_at']
