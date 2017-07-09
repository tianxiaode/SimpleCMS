using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace SimpleCMS.Helper
{
    public static class AppSettings
    {
        public static int? GetSettingAsInteger(string settingName)
        {
            return GetSettingAsType<int?>(settingName, obj => Convert.ToInt32(obj));
        }

        public static string GetSettingAsString(string settingName)
        {
            return GetSettingAsType<string>(settingName, Convert.ToString);
        }

        public static bool? GetSettingAsBool(string settingName)
        {
            return GetSettingAsType<bool?>(settingName, obj => Convert.ToBoolean(obj));
        }

        public static Guid? GetSettingAsGuid(string settingName)
        {
            return GetSettingAsType<Guid?>(settingName, obj => new Guid(obj as string));
        }

        public static TimeSpan? GetSettingAsTimeSpan(string settingName)
        {
            return GetSettingAsType<TimeSpan?>(settingName, obj => TimeSpan.Parse(obj as string));
        }

        public static DateTime? GetSettingAsDateTime(string settingName)
        {
            return GetSettingAsType<DateTime?>(settingName, obj => DateTime.Parse(obj as string));
        }

        public static void SetSettings(string settingName, string value)
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            if (!config.AppSettings.Settings.AllKeys.Contains(settingName))
                config.AppSettings.Settings.Add(settingName, value);    // add on fly if not exists
            else
                config.AppSettings.Settings[settingName].Value = value;
            config.Save(ConfigurationSaveMode.Modified);
            ConfigurationManager.RefreshSection("appSettings");
        }

        static Type GetSettingAsType<Type>(string settingName, Func<object, Type> callerConverter)
        {
            object obj = ConfigurationManager.AppSettings[settingName];
            if (obj != null)
            {
                Type value;
                try
                {
                    value = callerConverter(obj);
                }
                catch
                {
                    // For any invalid value, set to null
                    value = default(Type);
                }
                return value;
            }
            else
                return default(Type);
        }

    }
}