from flask import Flask

app = Flask(__name__)

votes = {
	"1e3": 2,
	"2e3": 17,
	"89a": 10
}

@app.route("/", methods=["GET", "POST"])
def serve_root():
	if request.method == "POST":
		picture = request.form();
		increment_vote(picture)
	else:



def increment_vote(id):
	votes[id] = votes[id] + 1
