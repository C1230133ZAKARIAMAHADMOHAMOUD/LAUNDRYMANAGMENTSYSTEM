using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LAUNDRYMANAGMENTSYSTEM.Data
{
    public class UserData
    {
        string conn = "data source=DESKTOP-IM83I23\\SQLEXPRESS;database=LAUNDRYMANAGMENTDB;integrated security=true;trustservercertificate=true";

        public List<UserModel> GetAll()
        {
            List<UserModel> list = new List<UserModel>();

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM USERS", con);

                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    list.Add(new UserModel
                    {
                        UserId = Convert.ToInt32(row["USERID"]),
                        FullName = row["FULLNAME"].ToString(),
                        UserName = row["USERNAME"].ToString(),
                        Password = row["PASSWORD"].ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("User GetAll Error: " + ex.Message);
            }

            return list;
        }

        // by iD
        public UserModel GetById(int id)
        {
            UserModel user = null;

            try
            {
                if (id <= 0) return null;

                SqlConnection con = new SqlConnection(conn);

                string query = "SELECT * FROM USERS WHERE USERID = @id";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    user = new UserModel
                    {
                        UserId = Convert.ToInt32(reader["USERID"]),
                        FullName = reader["FULLNAME"].ToString(),
                        UserName = reader["USERNAME"].ToString(),
                        Password = reader["PASSWORD"].ToString()
                    };
                }

                con.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("User GetById Error: " + ex.Message);
            }

            return user;
        }

        //insert
        public bool Insert(UserModel u)
        {
            if (u == null) return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO USERS (FULLNAME, USERNAME, PASSWORD) VALUES (@f,@u,@p)",
                    con);

                cmd.Parameters.AddWithValue("@f", u.FullName);
                cmd.Parameters.AddWithValue("@u", u.UserName);
                cmd.Parameters.AddWithValue("@p", u.Password);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("User Insert Error: " + ex.Message);
                return false;
            }
        }

        //update
        public bool Update(UserModel u)
        {
            if (u == null || u.UserId <= 0) return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand(
                    "UPDATE USERS SET FULLNAME=@f, USERNAME=@u, PASSWORD=@p WHERE USERID=@id",
                    con);

                cmd.Parameters.AddWithValue("@id", u.UserId);
                cmd.Parameters.AddWithValue("@f", u.FullName);
                cmd.Parameters.AddWithValue("@u", u.UserName);
                cmd.Parameters.AddWithValue("@p", u.Password);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("User Update Error: " + ex.Message);
                return false;
            }
        }

        //delete
        public bool Delete(int id)
        {
            if (id <= 0) return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("DELETE FROM USERS WHERE USERID=@id", con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("User Delete Error: " + ex.Message);
                return false;
            }
        }


        // LOGIN
        public bool Login(string username, string password)
        {
            try
            {
                SqlConnection con = new SqlConnection(conn);

                string query = "SELECT COUNT(*) FROM USERS WHERE USERNAME=@u AND PASSWORD=@p";
                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@u", username);
                cmd.Parameters.AddWithValue("@p", password);

                con.Open();
                int count = (int)cmd.ExecuteScalar();
                con.Close();

                return count > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("User Login Error: " + ex.Message);
                return false;
            }
        }
    }
}