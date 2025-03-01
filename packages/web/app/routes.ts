import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("share-target", "routes/share-target.tsx"),
	route("share-success", "routes/share-success.tsx"),
	route("not-found", "routes/not-found.tsx"),
] satisfies RouteConfig;
