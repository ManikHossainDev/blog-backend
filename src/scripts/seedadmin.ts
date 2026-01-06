import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";


async function  seedAdmin () {
    try {
      console.log("*** admin seeding started...")
      const adminData = {
        name: "Admin User",
        email: "admin1@gmail.com",
        role: UserRole.ADMIN,
        password: "admin123", 
      };
      // check user exist on db or not 
      const  existingUser = await prisma.user.findUnique({
        where: { email: adminData.email },
      })  

        if (existingUser) {
            throw new Error("Admin user already exists");
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adminData),
        });

        if (signUpAdmin.ok) {
          await prisma.user.update({
            where: {
              email: adminData.email,
            },
            data: {
              emailVerified: true,
            },
          });

          console.log("***** Success email verified");
        }

    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
}

seedAdmin();