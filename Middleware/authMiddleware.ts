import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: any, next: any) => {
  console.log("AUTH MIDDLEWARE HIT 🔐");
  
  try {

    // console.log("HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;
    console.log("RAW HEADER:", JSON.stringify(authHeader));

    // ❌ No header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Extract token
    // const token = authHeader.split(" ")[1];
    const token = authHeader.replace("Bearer ", "").trim();
    console.log("TOKEN:", token);

    // 🔐 Verify token
    const decoded: any = jwt.verify(token,process.env.JWT_SECRET_KEY!);
    console.log("SECRET:", process.env.JWT_SECRET);
console.log("SECRET_KEY:", process.env.JWT_SECRET_KEY);

    req.user = decoded;
      
console.log("DECODED TOKEN:", decoded);

// 


    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};