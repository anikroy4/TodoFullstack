import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const Registration = () => {
  const [form,setForm]=useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
 

  const dispatch=useDispatch();
  const {message, error}= useSelector((state)=>state.auth);

 

return (
  <>
    <div>
      <h2>Registration Here</h2>
      <form>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4
        flex flex-col items-center">
          <h2 className="font-extrabold text-2xl text-center">Create Your Account</h2>
        
            {/* <!-- Name Field --> */}
            <div >
                <label htmlFor="name" className="">Full Name</label>
                <div className="relative">
                    <input type="text" id="name" name="name" placeholder="John Doe"className="border py-2 px-3 rounded" required />
                </div>
            </div>

            {/* <!-- Email Field --> */}
            <div>
                <label htmlFor="email" className="">Email Address</label>
                <div className="relative">
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="john@example.com"
                        className=""
                        required
                    />
                </div>
            </div>

            {/* <!-- Password Field --> */}
            <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="********"
                        className=""
                        required
                    />
                </div>
            </div>

            {/* <!-- Terms and Conditions Checkbox --> */}
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="terms" 
                    name="terms" 
                    className="" 
                    required
                />
                <label htmlFor="terms" className="">
                    I agree to the <a href="link-to-terms.html" className="">Terms and Conditions</a>
                </label>
            </div>

            {/* <!-- Submit Button --> */}
            <div>
                <button 
                    type="submit"
                    className=""
                >
                    Register
                </button>
            </div>
        

          <p className="">
                Already have an account? <a href="#" className="">Log in here</a>.
          </p>
        </div>

      </form>
    </div>

  </>
  )
}

export default Registration