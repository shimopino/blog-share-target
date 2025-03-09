import {
	type RouteConfig,
	index,
	route,
	layout,
} from "@react-router/dev/routes";

export default [
	layout("layouts/app.tsx", [
		index("routes/home.tsx"),
		route("shared", "routes/shared.tsx"),
		route("not-found", "routes/not-found.tsx"),
	]),
] satisfies RouteConfig;
