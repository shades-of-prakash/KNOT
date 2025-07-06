import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router"; // use `react-router-dom` not `react-router`
import MainLayout from "./components/Layouts/MainLayout";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Signup from "./pages/Signup.jsx";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>

		<ThemeProvider>
				<AuthProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<MainLayout />}>
								<Route
									index
									element={<div className="bg-red-300">This is Home dude</div>}
								/>
								<Route
									path="popular"
									element={
										<div className="bg-green-900">
											This is home in Main layout
										</div>
									}
								/>
							</Route> 
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="*" element={<div>404 - Page Not Found</div>} />
						</Routes>
					</BrowserRouter>
				</AuthProvider>
		</ThemeProvider>
			</QueryClientProvider>

	);
}

export default App;
