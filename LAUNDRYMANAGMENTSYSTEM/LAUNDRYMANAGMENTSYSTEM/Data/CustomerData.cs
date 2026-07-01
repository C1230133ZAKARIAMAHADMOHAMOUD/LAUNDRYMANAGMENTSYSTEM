using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LAUNDRYMANAGMENTSYSTEM.Data
{
    public class CustomerData
    {
        string conn = "data source=DESKTOP-IM83I23\\SQLEXPRESS;database=LAUNDRYMANAGMENTDB;integrated security=true;trustservercertificate=true";

        public List<CustomerModel> GetAll()
        {
            List<CustomerModel> list = new List<CustomerModel>();

            try
            {
                SqlConnection con = new SqlConnection(conn);
                //dbase xog ka so aqri
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM CUSTOMERS", con);

                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    list.Add(new CustomerModel
                    {
                        CustomerId = Convert.ToInt32(row["CUSTOMERID"]),
                        FullName = row["FULLNAME"].ToString(),
                        Phone = row["PHONE"].ToString(),
                        Address = row["ADRESS"].ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return list;
        }

        //GET BY ID 
        public CustomerModel GetById(int id)
        {
            //marka hre xg kuma jirta 
            CustomerModel customer = null;

            try
            {
                if (id <= 0)
                    return null;

                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("SELECT * FROM CUSTOMERS WHERE CUSTOMERID = @id", con);
                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    customer = new CustomerModel
                    {
                        CustomerId = Convert.ToInt32(reader["CUSTOMERID"]),
                        FullName = reader["FULLNAME"].ToString(),
                        Phone = reader["PHONE"].ToString(),
                        Address = reader["ADRESS"].ToString()
                    };
                }

                con.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Customer GetById Error: " + ex.Message);
            }

            return customer;
        }


        //INSERT 
        public bool Insert(CustomerModel c)
        {
            if (c == null) 

                return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("INSERT INTO CUSTOMERS (FULLNAME, PHONE, ADRESS) VALUES (@n,@p,@a)", con);

                cmd.Parameters.AddWithValue("@n", c.FullName);
                cmd.Parameters.AddWithValue("@p", c.Phone);
                cmd.Parameters.AddWithValue("@a", c.Address);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Customer Insert Error: " + ex.Message);
                return false;
            }
        }

        //update 
        public bool Update(CustomerModel c)
        {
            if (c == null || c.CustomerId <= 0) 
                return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("UPDATE CUSTOMERS SET FULLNAME=@n, PHONE=@p, ADRESS=@a WHERE CUSTOMERID=@id", con);

                cmd.Parameters.AddWithValue("@id", c.CustomerId);
                cmd.Parameters.AddWithValue("@n", c.FullName);
                cmd.Parameters.AddWithValue("@p", c.Phone);
                cmd.Parameters.AddWithValue("@a", c.Address);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Customer Update Error: " + ex.Message);
                return false;
            }
        }

        //delete
        public bool Delete(int id)
        {
            if (id <= 0) return 
                    false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("DELETE FROM CUSTOMERS WHERE CUSTOMERID=@id", con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Customer Delete Error: " + ex.Message);
                return false;
            }
        }
    }
}