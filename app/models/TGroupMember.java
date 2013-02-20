package models;

import play.db.ebean.Model;

import java.util.List;

public class TGroupMember extends Model {

    public Long group_id;

    public Long user_id;

    public String remark;

    public static Finder<Long,TGroupMember> find = new Finder<Long, TGroupMember>(Long.class,TGroupMember.class);

    public static List<TGroupMember> findByGroup(Long groupId){
       return find.where().eq("groupId",groupId).findList();
    }

}
