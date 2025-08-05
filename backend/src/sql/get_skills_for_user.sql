SELECT * FROM "Users" WHERE 
  LOWER(firstname || ' ' || lastname || ' ' || patronymic) LIKE :search 
  OR LOWER(login) LIKE :search;
