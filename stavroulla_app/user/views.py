from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login
from django.contrib import messages

# Create your views here.
def login_view(request):
    template_name = "user/login.html"
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            print("yes")
            return redirect('dashboard')
        else:
            messages.error(request, "Please enter correct username and password. Remeber, both fields are case sensative")
            return redirect('login')
    return render(request, template_name)

    

