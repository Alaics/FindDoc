from django.contrib.auth.models import User
from base.models import Appointment, Doctor, Product, CustomUser, Order, OrderItem, ShippingAddress
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import api_view,permission_classes
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .serializer import AppointmentSerializer, DoctorSerializer, DoctorDetailSerializer, ProductSerializer,UserSerializer,UserSerializerWithToken,OrderSerializer
from datetime import datetime
from rest_framework.permissions import AllowAny



@api_view(['GET'])
def getRoutes(request):
    return Response('Hello')

@api_view(['GET'])
def getProducts(request):
    products=Product.objects.all()
    serializer=ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request,pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    
    # (1) Create order
    order = Order.objects.create(
        user=user,
        paymentMethod=data['paymentMethod'],
        taxPrice=data['taxPrice'],
        shippingPrice=data['shippingPrice'],
        totalPrice=data['totalPrice']
    )

    # (2) Create shipping address
    shipping = ShippingAddress.objects.create(
        order=order,
        address=data['shippingAddress']['address'],
        city=data['shippingAddress']['city'],
        postalCode=data['shippingAddress']['postalCode'],
        country=data['shippingAddress']['country'],
    )

    # (3) Create order items and set order to orderItem relationship
    for i in orderItems:
        product = Product.objects.get(_id=i['product'])

        item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i['qty'],
            price=i['price'],
            image=product.image.url
        )

        # (4) Update stock
        product.countInStock -= item.qty
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'},
                            status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()
        return Response({'detail': 'Order was paid'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        order.isDelivered = True
        order.deliveredAt = datetime.now()
        order.save()
        return Response({'detail': 'Order was delivered'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self,attrs):
        data=super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v
    

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
    
        


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def  getUserProfile(request):
    user=request.user
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def  getUsers(request):
    user=User.objects.all()
    serializer=UserSerializer(user,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    print(data)
    
    # Check if the user already exists
    if CustomUser.objects.filter(email=data['email']).exists():
        message = {'details': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.create(
            first_name=data['name'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        # Log the exception for debugging
        print("Error creating user:", str(e))
        message = {'details': 'An error occurred while creating the user'}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')

# Doctors

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getAllDoctors(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
# @permission_classes([IsAdminUser])
def getDoctorDetail(request, pk):
    try:
        doctor = Doctor.objects.get(user_id=pk)
        serializer = DoctorSerializer(doctor, many=False)
        return Response(serializer.data)
    except Doctor.DoesNotExist:
        return Response({'detail': 'Doctor not found'}, status=404)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def create_appointment(request):
    print(request.data)  # Log the incoming request data
    if request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Print any validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createDoctorReview(request, pk):
    user = request.user
    
    # Check if the doctor exists
    try:
        doctor = Doctor.objects.get(_id=pk)  # Correct the model name to Doctor
    except Doctor.DoesNotExist:
        return Response({'detail': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # 1 Check if the user has consulted the doctor
    if not Appointment.objects.filter(user=user, doctor=doctor).exists():
        return Response({'detail': 'You must consult this doctor before leaving a review.'}, status=status.HTTP_400_BAD_REQUEST)

    # 2 Review already exists
    alreadyExists = doctor.review_set.filter(user=user).exists()
    if alreadyExists:
        return Response({'detail': 'Already reviewed'}, status=status.HTTP_400_BAD_REQUEST)

    # 3 No Rating or 0
    if data.get('rating') == 0:
        return Response({'detail': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

    # 4 Create review
    review = Review.objects.create(
        user=user,
        doctor=doctor,
        name=user.first_name,
        rating=data['rating'],
        comment=data.get('comment', ''),  # Use .get() to provide a default
    )

    # Update doctor rating and number of reviews
    reviews = doctor.review_set.all()
    doctor.numReviews = len(reviews)

    total = sum(review.rating for review in reviews)  # Efficiently calculate total rating
    doctor.rating = total / doctor.numReviews if doctor.numReviews > 0 else 0  # Handle division by zero
    doctor.save()

    return Response({'detail': 'Review added'}, status=status.HTTP_201_CREATED)
