using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BenefitsPreview.Models
{
    public class Employee
    {
        private List<Dependent> dependents;

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public List<Dependent> Dependents
        {
            get
            {
                if (dependents == null)
                    dependents = new List<Dependent>();

                return dependents;
            }
            set
            {
                dependents = value;
            }
        }
    }
}
