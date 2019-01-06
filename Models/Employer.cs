using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BenefitsPreview.Models
{
    public class Employer
    {
        public string CompanyName { get; set; }
        public List<Employee> Employees { get; set;}
    }
}
