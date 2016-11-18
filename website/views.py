from django.shortcuts import render, render_to_response
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')
    # return render_to_response('index.html', context_instance=RequestContext(request))
