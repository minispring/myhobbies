package models;

import com.avaje.ebean.annotation.Where;
import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.format.Formats;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="comments")
public class TComment extends Model {

    @Id
    @GeneratedValue
    public Long id;

    @Constraints.Required
    public String content;

    @ManyToOne
    @JsonBackReference
    public User author;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date create_at;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date update_at;

    //e.g. modified or not
    public String status;

    @OneToMany(mappedBy = "comment")
    @JsonIgnore
    public List<TLike> likes;

    @OneToMany(mappedBy = "comment")
    @JsonIgnore
    public List<TMention> mentions;

    @ManyToOne
    @JsonBackReference
    public TPost post;

    //e.g. POST,COMMENT,PHOTO
    public String commentable_type;

    public static Finder<Long,TComment> find = new Finder<Long, TComment>(Long.class,TComment.class);

    public static List<TComment> findComments(TPost post,Integer pageNum,Integer maxRow){
        return find.where().eq("post",post)
                .orderBy("create_at DESC")
                .findPagingList(maxRow).getPage(pageNum).getList();
    }

    public static List<TComment> findLastThreeComments(TPost post){
        return findComments(post,1,3);
    }

}
