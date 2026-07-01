using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LAUNDRYMANAGMENTSYSTEM.Data
{
    public class OrderData
    {
        string conn = "data source=DESKTOP-IM83I23\\SQLEXPRESS;database=LAUNDRYMANAGMENTDB;integrated security=true;trustservercertificate=true";

        public List<OrderModel> GetAll()
        {
            List<OrderModel> list = new List<OrderModel>();

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM ORDERS", con);

                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    list.Add(new OrderModel
                    {
                        OrderId = Convert.ToInt32(row["ORDERID"]),
                        CustomerId = Convert.ToInt32(row["CUSTOMERID"]),
                        ServiceId = Convert.ToInt32(row["SERVICEID"]),
                        OrderDate = Convert.ToDateTime(row["ORDERDATE"]),
                        TotalAmount = Convert.ToDecimal(row["TOTALAMOUNT"]),
                        Statuss = row["STATUSS"].ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Order GetAll Error: " + ex.Message);
            }

            return list;
        }

        // Get a specific order by its ID
        public OrderModel GetById(int id)
        {
            OrderModel order = null;
            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("SELECT * FROM ORDERS WHERE ORDERID=@id", con);
                cmd.Parameters.AddWithValue("@id", id);
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    order = new OrderModel
                    {
                        OrderId = Convert.ToInt32(reader["ORDERID"]),
                        CustomerId = Convert.ToInt32(reader["CUSTOMERID"]),
                        ServiceId = Convert.ToInt32(reader["SERVICEID"]),
                        OrderDate = Convert.ToDateTime(reader["ORDERDATE"]),
                        TotalAmount = Convert.ToDecimal(reader["TOTALAMOUNT"]),
                        Statuss = reader["STATUSS"].ToString()
                    };
                }
                con.Close();
            }
            catch (Exception ex) { Console.WriteLine("GetById Error: " + ex.Message); }
            return order;
        }

        // Insert a new order into the database
        public bool Insert(OrderModel o)
        {
            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO ORDERS (CUSTOMERID,SERVICEID,ORDERDATE,TOTALAMOUNT,STATUSS) VALUES (@c,@s,@d,@t,@st)", con);
                cmd.Parameters.AddWithValue("@c", o.CustomerId);
                cmd.Parameters.AddWithValue("@s", o.ServiceId);
                cmd.Parameters.AddWithValue("@d", o.OrderDate);
                cmd.Parameters.AddWithValue("@t", o.TotalAmount);
                cmd.Parameters.AddWithValue("@st", o.Statuss);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception ex) { Console.WriteLine("Insert Error: " + ex.Message); return false; }
        }

        // Update an existing order in the database
        public bool Update(OrderModel o)
        {
            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand(
                    "UPDATE ORDERS SET CUSTOMERID=@c,SERVICEID=@s,ORDERDATE=@d,TOTALAMOUNT=@t,STATUSS=@st WHERE ORDERID=@id", con);
                cmd.Parameters.AddWithValue("@id", o.OrderId);
                cmd.Parameters.AddWithValue("@c", o.CustomerId);
                cmd.Parameters.AddWithValue("@s", o.ServiceId);
                cmd.Parameters.AddWithValue("@d", o.OrderDate);
                cmd.Parameters.AddWithValue("@t", o.TotalAmount);
                cmd.Parameters.AddWithValue("@st", o.Statuss);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception ex) { Console.WriteLine("Update Error: " + ex.Message); 
                return false; }
        }

        // Delete an order from the database by its ID
        public bool Delete(int id)
        {
            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("DELETE FROM ORDERS WHERE ORDERID=@id", con);
                cmd.Parameters.AddWithValue("@id", id);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                return true;
            }
            catch (Exception ex) { 
                Console.WriteLine("Delete Error: " + ex.Message); 
                return false; }
        }


    }
}