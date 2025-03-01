import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("not-found", "routes/not-found.tsx"),
	route("shared", "routes/shared.tsx"),
] satisfies RouteConfig;
