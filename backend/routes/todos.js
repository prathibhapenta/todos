const express = require('express')
const router = express.Router() 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require("../db")

const auth = require("../middleware/auth")

router.get("/gettodo", auth, async (req, res) => {
  try {
    const userId = req.user.userId

    const response = await pool.query(
      `SELECT * FROM demotable WHERE user_id = $1`,
      [userId]
    )

    res.status(200).json(response.rows)
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
})

router.post("/inserttodo", auth, async (req, res) => {
  try {
    const { name, description } = req.body
    const userId = req.user.userId

    const inserttodo = await pool.query(
      `INSERT INTO demotable (name, description, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, userId]
    )

    res.status(201).json(inserttodo.rows[0])
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
})

router.put("/updatetodo/:id", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const userId = req.user.userId

    const updatetodo = await pool.query(
      `UPDATE demotable
       SET name = $1, description = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name, description, id, userId]
    )

    if (updatetodo.rows.length === 0) {
      return res.status(404).json({
        message: "Todo Not Found"
      })
    }

    res.status(200).json(updatetodo.rows[0])
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
})

router.delete("/deletetodo/:id", auth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const deletetodo = await pool.query(
      `DELETE FROM demotable
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    )

    if (deletetodo.rows.length === 0) {
      return res.status(404).json({
        message: "Todo Not Found"
      })
    }

    res.status(200).json(deletetodo.rows[0])
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
})

//register routes 
router.post('/register',  async(req,res) => {
    try{
        const {email,password} = req.body

        if(!email?.trim() || !password?.trim()){
            return res.status(400).json({
                message: "Email and Password Required*"
            })
        }

        const existinguser = await pool.query(
            `SELECT * FROM userslogin WHERE email = $1`,[email]
        )

        if(existinguser.rows.length >0) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }
        const hashedpassword = await bcrypt.hash(password,10)
        const user = await pool.query(
            `INSERT INTO userslogin (email,password) VALUES ($1,$2) RETURNING *`,[email,hashedpassword]
        )
        res.status(201).json(user.rows[0])
    }
    catch(error){
        res.status(500).json({
            message: "Registration Failed",
            error: error.message
        })
    }
})

//login routes
router.post('/login',  async(req,res) => {
    try{
        const {email,password} = req.body

        if(!email?.trim() || !password?.trim()){
            return res.status(400).json({
                message: "Email and Password Required"
            })
        }

        const userlogin = await pool.query(
            `SELECT * FROM userslogin WHERE email = $1`,
            [email]
        )

        if(userlogin.rows.length === 0){
            return res.status(404).json({
                message: "Email Not found"
            })
        }
        console.log("Entered Password:", password)
        const isPasswordMatched = await bcrypt.compare(
            password,
            userlogin.rows[0].password
        )
        console.log("Password Match:", isPasswordMatched)

        if(!isPasswordMatched){
            return res.status(400).json({
                message: "Invalid Password"
            })
        }

        const token = jwt.sign(
            {
                userId: userlogin.rows[0].id,
                email: userlogin.rows[0].email
            },
            process.env.JWT_SECRET,
             {
               expiresIn: '1d'
              }
        )

        res.status(200).json({
            message: "Login Success",
            token
        })

    }catch(error){
        res.status(500).json({
            message: "Login Failed",
            error: error.message
        })
    }
})

//forget-password
router.post('/forgot-password',  async(req,res) => {
    try{
        const {email} = req.body 

        const forgetpassword = await pool.query(`
            SELECT * FROM userslogin WHERE email = $1`, [email])
        
            if(forgetpassword.rows.length === 0){
                return res.status(404).json({
                    message: "Email Not found"
                })
            }
            res.status(200).json({
                message: "Email Verified"
            })
    }
    catch(error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
})

router.put('/reset-password',  async(req,res) => {
    try{
        const {email,newPassword} = req.body
        const hashedPassword = await bcrypt.hash(newPassword,10)
        await pool.query(`
            UPDATE userslogin SET password = $1 WHERE email = $2`,[hashedPassword,email])
        res.status(200).json({
            message: "Password Updated Successfully"
        })
    }catch(error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
})



module.exports = router

