from twilio.rest import Client

account_sid = "AC7c52a2581fcbe90c6178bf97c872f962"
auth_token = ""

client = Client(account_sid, auth_token)

def send_text(phonenum):
	phonenum = "+1" + phonenum
	print(phonenum)
	message = client.messages.create(
	    to=phonenum,
	    from_="+17786558498 ",
	    body="The bell is ringing!")
	print(message.sid)