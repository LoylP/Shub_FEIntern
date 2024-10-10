import requests

response = requests.get("https://test-share.shub.edu.vn/api/intern-test/input")
data_json = response.json()
token = data_json['token']
data = data_json['data']
queries = data_json['query']

results = []

def prefix_sum(data, l, r, type):
    if type == "1":
        return sum(data[l:r+1])
    elif type == "2":
        return sum(data[i] if i % 2 == 0 else -data[i] for i in range(l, r + 1))


for query in queries:
    type_prefix = query["type"]
    l = query["range"][0]
    r = query["range"][1]
    results.append(prefix_sum(data, l, r, type_prefix))

print("Results: ", results)

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

response = requests.post("https://test-share.shub.edu.vn/api/intern-test/output", 
                         headers=headers, 
                         json=results)

if response.status_code == 200:
    print("Results successfully sent.")
else:
    print("Failed to send results:", response.status_code, response.text)