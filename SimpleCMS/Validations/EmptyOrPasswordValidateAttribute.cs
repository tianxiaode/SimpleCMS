using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;

namespace SimpleCMS.Validations
{
    public class EmptyOrPasswordValidateAttribute : ValidationAttribute
    {
        public EmptyOrPasswordValidateAttribute(bool allowEmpry, int requiredLength = 8, bool requireNonLetterOrDigit = true, bool requireDigit=true, bool requireLowercase=true, bool requireUppercase=true)
        {
            AllowEmpry = allowEmpry;
            RequiredLength = requiredLength;
            RequireNonLetterOrDigit = requireNonLetterOrDigit;
            RequireDigit = requireDigit;
            RequireLowercase = requireLowercase;
            RequireUppercase = requireUppercase;
        }

        public bool AllowEmpry { get; }
        public int RequiredLength { get;  }
        public bool RequireNonLetterOrDigit { get; }
        public bool RequireDigit { get; }
        public bool RequireLowercase { get; }
        public bool RequireUppercase { get; }

        public override bool IsValid(object value)
        {
            var password = (string) value;
            if (AllowEmpry && string.IsNullOrEmpty(password)) return true;
            return MatchesPassword(password);
        }

        internal bool MatchesPassword( string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < RequiredLength)
            {
                return false;
            }
            if (RequireNonLetterOrDigit && password.All(IsLetterOrDigit))
            {
                return false;
            }
            if (RequireDigit && !password.Any(IsDigit))
            {
                return false;
            }
            if (RequireLowercase && !password.Any(IsLower))
            {
                return  false;
            }
            return !RequireUppercase || password.Any(IsUpper);
        }

        internal bool IsDigit(char c)
        {
            return c >= '0' && c <= '9';
        }

        internal bool IsLower(char c)
        {
            return c >= 'a' && c <= 'z';
        }

        internal bool IsUpper(char c)
        {
            return c >= 'A' && c <= 'Z';
        }

        internal bool IsLetterOrDigit(char c)
        {
            return IsUpper(c) || IsLower(c) || IsDigit(c);
        }

        public override string FormatErrorMessage(string name)
        {
            return string.Format(CultureInfo.CurrentCulture,
              ErrorMessageString, name, "");
        }
    }
}