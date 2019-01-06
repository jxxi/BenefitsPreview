using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BenefitsPreview.Models
{
    public class Dependent
    {
        public DependentType DependentType { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
