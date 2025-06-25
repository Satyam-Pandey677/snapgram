import AuthLayout from "./_auth/AuthLayout";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import { CreatePost, Explore, Home, Liked, Profile, Saved, UpdatePost, UpdateProfile } from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import AllUsers from "./_root/pages/AllUsers";
import PostDeatils from "./_root/pages/PostDeatils";


function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        <Route element = {<RootLayout/>}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<UpdatePost />} />
          <Route path="/posts/:id/*" element={<PostDeatils />} />
          <Route path="/profile/:id/*" element={<Profile/>} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/liked" element={<Liked />} />
        </Route>
      </Routes>

      <Toaster/>
    </main>
  );
}

export default App;
