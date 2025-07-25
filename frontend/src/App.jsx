import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./components/Layouts/MainLayout";
import TopPosts from "./components/TopPosts"; // This is the home feed
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CommentPost from "./components/CommentPost.jsx";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AuthProvider>
					<BrowserRouter>
						<Toaster
							position="top-center"
							theme="dark"
							richColors
							closeButton
						/>
						<Routes>
							<Route path="/" element={<MainLayout />}>
								<Route index element={<TopPosts type="random" />} />
								<Route path="popular" element={<TopPosts type="top" />} />
								<Route path="/profile" element={<ProfilePage />} />
								<Route path="/comment-post/:id" element={<CommentPost />} />
							</Route>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/verify-email" element={<VerifyEmail />} />

							{/* 404 fallback */}
							<Route
								path="*"
								element={
									<div className="text-center text-white p-10">
										<h1 className="text-3xl font-bold mb-2">404</h1>
										<p>Page Not Found</p>
									</div>
								}
							/>
						</Routes>
					</BrowserRouter>
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
