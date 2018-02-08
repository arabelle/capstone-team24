from twilio.rest import Client

account_sid = "ACd89023d1020a2bc96866a5bca3b6123c"
auth_token = "49daf2d485e17d871b45f0a392212e68"

client = Client(account_sid, auth_token)

def send_text(phonenum):
	phonenum = "+1" + phonenum
	message = Client.messages.create(
	    to=phonenum,
	    from_="+15005550006",
	    body="The bell is ringing!")
	print(message.sid)