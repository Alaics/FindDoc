from django.contrib import admin
from base.models import *
# Register your models here.

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Review)
admin.site.register(CustomUser)
admin.site.register(Doctor)
admin.site.register(Appointment)