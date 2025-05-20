import { z } from "zod";
import { fromZodError } from 'zod-validation-error';

export default function(data) {

	// Draft content, validate `draft` front matter

	let Post = z.object({
		draft: z.boolean().or(z.undefined()),
	});

	let result = Post.safeParse(data);

	if(result.error) {
		throw fromZodError(result.error);
	}

}
