import requests

def post_pi():
	pi_url = "http://70.79.163.198:8000"
	r = requests.post(pi_url, data={"alert": "yes"})
	print(r.status_code, r.reason)