interface ShareParams {
	url?: string;
	title?: string;
	text?: string;
}

export async function shareContent(params: ShareParams) {
	const response = await fetch("/api/share", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	});

	if (!response.ok) {
		throw new Error(`APIステータスコード: ${response.status}`);
	}

	return response.json();
}
